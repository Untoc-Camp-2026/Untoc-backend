import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import dynamic from "next/dynamic";

const Calendar = dynamic(() => import("react-calendar"), {
  ssr: false,
});
import "react-calendar/dist/Calendar.css";

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#FFFDF8]">
        <div className="mx-auto max-w-7xl px-8 py-14">
          {/* 제목 */}
          <div className="mb-10 flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#4F3428]">
                CALENDAR
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                우측 달력의 날짜를 더블클릭하여 상세 정보를 확인하세요.
              </p>
            </div>

            <button
              className="
                rounded-full
                bg-[#6A4E43]
                px-5
                py-2
                text-white
                transition
                hover:bg-[#4F3428]
              "
            >
              일정 등록하기
            </button>
          </div>

          {/* 본문 */}
          <div className="grid grid-cols-2 gap-12">
            {/* 일정 카드 */}
            <section>
              <h2 className="mb-4 text-2xl font-bold text-[#4F3428]">
                {date instanceof Date
                  ? date.toLocaleDateString("ko-KR")
                  : "날짜를 선택하세요"}
              </h2>

              <div
                className="
                  flex
                  h-[470px]
                  items-center
                  justify-center
                  rounded-3xl
                  border
                  border-[#E4D19C]
                  bg-[#FFF3C8]
                "
              >
                <p className="text-gray-500">
                  오늘 등록된 일정이 없습니다.
                </p>
              </div>
            </section>

            {/* 달력 */}
            <section>
              <div
                className="
                  flex
                  h-[620px]
                  items-center
                  justify-center
                  rounded-3xl
                  border
                  border-gray-200
                  bg-white
                  p-6
                  shadow-sm
                "
              >
                <Calendar
                    value={date}
                    onChange={(value) => {
                        if (value instanceof Date) {
                            setDate(value);
                        }
                    }}
                />
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}