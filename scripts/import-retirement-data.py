"""Build the longer US-inflation retirement reference from pinned public observations.
Refresh BLS with --download; the market inputs are shared with the DCA importer.
"""
import argparse
import csv
import datetime as dt
import hashlib
import json
import pathlib
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
RAW = ROOT / 'data/retirement/raw'
URL = 'https://api.bls.gov/publicAPI/v2/timeseries/data/CUUR0000SA0?startyear=2023&endyear=2025'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--download', action='store_true')
args = parser.parse_args()
RAW.mkdir(parents=True, exist_ok=True)
if args.download:
    with urllib.request.urlopen(URL, timeout=40) as response:
        (RAW / 'us-cpi.json').write_bytes(response.read())

def month_id(month):
    year, number = map(int, month.split('-'))
    return year * 12 + number - 1

def month_text(index):
    return f'{index // 12:04d}-{index % 12 + 1:02d}'

sp_path = ROOT / 'data/dca/raw/sp500.csv'
tr_path = ROOT / 'data/dca/raw/sp500-total-return.json'
rows = {row['Date'][:7]: row for row in csv.DictReader(sp_path.open())}
tr_raw = json.loads(tr_path.read_text())['chart']['result'][0]
tr = {dt.datetime.fromtimestamp(t, dt.timezone.utc).strftime('%Y-%m'): value
      for t, value in zip(tr_raw['timestamp'], tr_raw['indicators']['quote'][0]['close']) if value}
bls_raw = json.loads((RAW / 'us-cpi.json').read_text())
if bls_raw['status'] != 'REQUEST_SUCCEEDED':
    raise ValueError('BLS request did not succeed')
bls = {f"{row['year']}-{row['period'][1:]}": float(row['value'])
       for row in bls_raw['Results']['series'][0]['data'] if row['period'] != 'M13' and row['value'] != '-'}
start = '1928-01'
end = json.loads((ROOT / 'content/dca-history.json').read_text())['end']
months = [month_text(i) for i in range(month_id(start), month_id(end) + 1)]
levels, cpi = [100.0], []
for index, month in enumerate(months):
    # Chain BLS changes to Shiller's CPI level at the June 2023 overlap.
    value = float(rows[month]['Consumer Price Index']) if month <= '2023-06' else (
        bls[month] * float(rows['2023-06']['Consumer Price Index']) / bls['2023-06'])
    if value <= 0:
        raise ValueError(f'Missing CPI at {month}')
    cpi.append(round(value, 8))
    if index:
        previous = months[index - 1]
        if month <= '2023-06':
            price, dividend = float(rows[month]['SP500']), float(rows[month]['Dividend'])
            if price <= 0 or dividend <= 0:
                raise ValueError(f'Missing market observation at {month}')
            factor = (price + dividend / 12) / float(rows[previous]['SP500'])
        else:
            factor = tr[month] / tr[previous]
        levels.append(levels[-1] * factor)

manifest_path = ROOT / 'data/retirement/manifest.json'
retrieved_on = dt.datetime.now(dt.timezone.utc).date().isoformat() if args.download or not manifest_path.exists() else json.loads(manifest_path.read_text())['retrievedOn']
result = {'version': 1, 'retrievedOn': retrieved_on, 'start': start, 'end': end,
          'levels': [round(n, 8) for n in levels], 'cpi': cpi}
(ROOT / 'content/retirement-us-history.json').write_text(json.dumps(result, separators=(',', ':')) + '\n')
manifest = {'retrievedOn': retrieved_on, 'start': start, 'end': end, 'observations': len(months),
            'sources': [
                {'file': str(p.relative_to(ROOT)), 'sha256': hashlib.sha256(p.read_bytes()).hexdigest(), 'url': url}
                for p, url in [(sp_path, 'https://datahub.io/core/s-and-p-500'),
                               (tr_path, 'https://finance.yahoo.com/quote/%5ESP500TR/history/'),
                               (RAW / 'us-cpi.json', URL)]],
            'method': 'Monthly reinvested Shiller dividends through 2023-06, then Yahoo total-return ratios. Shiller US CPI through 2023-06, then BLS CPI-U unadjusted changes. No missing months are interpolated.'}
manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
print(f'US reference: {start} to {end}, {len(months)} monthly observations.')
