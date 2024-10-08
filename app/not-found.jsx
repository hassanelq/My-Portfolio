export default function NotFound() {
  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-center text-center ">
      <div>
        <h1 className=" text-[8rem] font-semibold text-transparent !bg-clip-text [background:linear-gradient(90deg,_#d4d4d4,_#797979)] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
          ERROR 404
        </h1>
        <p className="opacity-85 text-[3rem]">Page not found</p>
      </div>
    </div>
  );
}
