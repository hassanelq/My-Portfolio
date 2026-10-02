"""Rebuild the pinned historical DCA dataset; --download refreshes raw public sources.
No values are extrapolated, interpolated or replaced by assumed growth rates.
"""
import argparse
import csv
import datetime as dt
import hashlib
import json
import pathlib
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
RAW = ROOT / 'data/dca/raw'
SOURCES = {
    'sp500.csv': 'https://datahub.io/core/s-and-p-500/_r/-/data/data.csv',
    'gold.csv': 'https://datahub.io/core/gold-prices/_r/-/data/monthly.csv',
    'msci-world.json': 'https://query1.finance.yahoo.com/v8/finance/chart/%5E990100-USD-STRD?period1=0&period2=1767225600&interval=1mo',
    'sp500-total-return.json': 'https://query1.finance.yahoo.com/v8/finance/chart/%5ESP500TR?period1=1640995200&period2=1767225600&interval=1mo',
    'morocco-cpi.json': 'https://api.db.nomics.world/v22/series/IMF/IFS/M.MA.PCPI_IX?observations=1',
}

def month_id(month):
    year, number = map(int, month.split('-'))
    return year * 12 + number - 1

def month_text(index):
    return f'{index // 12:04d}-{index % 12 + 1:02d}'

def monthly_prices(filename):
    data = json.loads((RAW / filename).read_text())['chart']['result'][0]
    return {dt.datetime.fromtimestamp(timestamp, dt.timezone.utc).strftime('%Y-%m'): value
            for timestamp, value in zip(data['timestamp'], data['indicators']['quote'][0]['close'])
            if value is not None and value > 0}

def contiguous(series, start, end):
    months = [month_text(index) for index in range(month_id(start), month_id(end) + 1)]
    missing = [m for m in months if m not in series or series[m] <= 0]
    if missing:
        raise ValueError(f'Missing or invalid observations: {missing[:10]}')
    return [round(series[m], 8) for m in months]

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--download', action='store_true')
args = parser.parse_args()
if args.download:
    for filename, url in SOURCES.items():
        request = urllib.request.Request(url, headers={'User-Agent': 'Portfolio historical DCA data importer'})
        with urllib.request.urlopen(request, timeout=40) as response:
            (RAW / filename).write_bytes(response.read())

cpi_doc = json.loads((RAW / 'morocco-cpi.json').read_text())['series']['docs'][0]
cpi = {month: value for month, value in zip(cpi_doc['period'], cpi_doc['value'])
       if isinstance(value, (int, float)) and value > 0}
sp_rows = {row['Date'][:7]: row for row in csv.DictReader((RAW / 'sp500.csv').open())}
gold = {row['Date'][:7]: float(row['Price']) for row in csv.DictReader((RAW / 'gold.csv').open())}
world = monthly_prices('msci-world.json')
tr = monthly_prices('sp500-total-return.json')
end = min(max(cpi), max(sp_rows), max(gold), max(world), max(tr), '2025-12')
start = '1960-01'
# Reinvest 1/12 of the annualized Shiller dividend at each monthly observation.
# After June 2023, use observed Yahoo S&P 500 total-return index ratios.
sp = {start: 100.0}
for index in range(month_id(start) + 1, month_id(end) + 1):
    month, previous = month_text(index), month_text(index - 1)
    if month <= '2023-06':
        row = sp_rows[month]
        dividend = float(row['Dividend'])
        if dividend <= 0:
            raise ValueError(f'Missing S&P dividend: {month}')
        factor = (float(row['SP500']) + dividend / 12) / float(sp_rows[previous]['SP500'])
    else:
        factor = tr[month] / tr[previous]
    sp[month] = sp[previous] * factor

manifest_path = ROOT / 'data/dca/manifest.json'
retrieved_on = dt.datetime.now(dt.timezone.utc).date().isoformat() if args.download else (json.loads(manifest_path.read_text())['retrievedOn'] if manifest_path.exists() else '2026-10-02')
result = {
    'version': 1,
    'retrievedOn': retrieved_on,
    'start': start,
    'end': end,
    'cpi': contiguous(cpi, start, end),
    'assets': {
        'sp500': {'start': start, 'levels': contiguous(sp, start, end)},
        'gold': {'start': '1968-01', 'levels': contiguous(gold, '1968-01', end)},
        'world': {'start': '1985-01', 'levels': contiguous(world, '1985-01', end)},
    },
}
(ROOT / 'content/dca-history.json').write_text(json.dumps(result, separators=(',', ':')) + '\n')
manifest = {
    'retrievedOn': retrieved_on,
    'cutoff': end,
    'sources': [{'file': name, 'url': url, 'sha256': hashlib.sha256((RAW / name).read_bytes()).hexdigest()} for name, url in SOURCES.items()],
    'series': {key: {'start': value['start'], 'end': end, 'observations': len(value['levels'])} for key, value in result['assets'].items()},
    'cpi': {'provider': 'IMF IFS via DBnomics', 'series': 'M.MA.PCPI_IX', 'start': start, 'end': end, 'observations': len(result['cpi'])},
}
(ROOT / 'data/dca/manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(json.dumps(manifest['series'], indent=2))
print(f'CPI: {len(result["cpi"])} monthly observations. Shared end date: {end}.')
