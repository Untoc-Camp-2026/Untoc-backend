import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>

      <main
        className="relative flex h-[840px] items-center justify-center overflow-hidden"
        style={{
          background: `
          radial-gradient(circle at 85% 20%, rgba(247, 217, 136, 0.28), transparent 30%),
          radial-gradient(circle at 15% 85%, rgba(247, 217, 136, 0.22), transparent 30%),
          #FFFDF8
          `,
        }}
>
        <section className="flex flex-col items-center text-center -mt-16">

          <div className="rounded-full bg-[#FBEFBE] px-6 py-2 text-[18px] font-medium text-[#A07A72] shadow-sm">
            PNU CSE Club · Est. 2008
          </div>

          <h1
            className="
              mt-2
              text-[100px]
              font-black
              leading-none
              tracking-tight
              text-[#6B4E48]
            "
          >
            UNTOC
          </h1>

          <p className="mt-2 text-[24px] font-medium text-[#9A7870]">
            Untouchable Ceaseless
          </p>

          </section>
      </main>

    </>
  );
}