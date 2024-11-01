

export default function LoginLayout({ children }) {
  return (
    <main
      style={{backgroundImage: 'linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)'}} 
      className="w-screen h-screen pt-[200px] bg-[#8EC5FC] bg- ">
     
      <div className="mx-auto w-[400px] p-10  bg-white rounded-xl shadow-xl">
        {children}
      </div>

      <div className="absolute bottom-0 text-center w-full py-2 text-base">
        @travelx.pro
      </div>
    </main>
  )
}