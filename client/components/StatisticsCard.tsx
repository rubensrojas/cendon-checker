import Image from "next/image";
import Loading from "./Loading";

const StatisticsCard = ({
  winRate,
  last24Hours,
  lastWeek,
  lastMonth,
  mostPlayedChampion,
  isLoading,
}: {
  winRate: number;
  last24Hours: number;
  lastWeek: number;
  lastMonth: number;
  mostPlayedChampion: {
    champion: string;
    count: number;
  };
  isLoading: boolean;
}) => {
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-row justify-between items-center bg-foreground rounded-lg p-4 border border-white/5">
      <div className="flex flex-col gap-2 justify-evenly">
        <p className="font-bold text-sm">Jogos nas últimas</p>
        <p className=" text-xs">24 horas: {last24Hours} jogos</p>
        <p className=" text-xs">7 dias: {lastWeek} jogos</p>
        <p className=" text-xs">30 dias: {lastMonth} jogos</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col items-center">
          <Image
            src={`/images/champions-icons/${mostPlayedChampion.champion}.png`}
            alt={mostPlayedChampion.champion}
            width={100}
            height={100}
            className="h-12 w-12 rounded-full"
          />
          <p className="text-sm mt-1">{mostPlayedChampion.champion}</p>
          <p className="text-xs text-gray-400">{mostPlayedChampion.count} jogos</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="relative overflow-hidden h-[80px] w-[80px] rounded-full flex items-center justify-center bg-defeat-red">
          <div
            className="absolute h-[80px] w-[80px] bg-victory-blue"
            style={{
              transform: `translateY(${100 - winRate}%)`,
            }}
          ></div>
          <div className="absolute h-[76px] w-[76px] rounded-full bg-foreground"></div>
          <div className="text-lg font-bold z-10">{winRate}%</div>
        </div>
        <p className="text-sm">Win Rate</p>
      </div>

    </div>
  );
};

export default StatisticsCard;
