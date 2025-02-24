/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { FormattedMatch } from '../interfaces/matches';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

export default function GameRow({
  date,
  win,
  champion,
  kills,
  deaths,
  assists,
  damage,
  gold,
  gameLength,
}: FormattedMatch) {
  const gameLengthData = {
    minutes: Math.floor(gameLength / 60),
    seconds: gameLength % 60,
  };

  const formattedGameLength = `${gameLengthData.minutes}m ${gameLengthData.seconds}s`;

  return (
    <div
      className={
        'flex flex-row justify-between items-center bg-foreground rounded-lg p-4 border ' +
        (win ? 'border-victory-blue/50' : 'border-defeat-red/50')
      }
    >
      <div className="flex flex-row items-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <div className="w-[100px] h-[100px] bg-gray-800 rounded-md">
            <Image
              src={`/images/champions-icons/${champion}.png`}
              alt={champion}
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
          <p className="text-sm font-bold">{champion}</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-lg font-bold tracking-widest">
            K/D/A
          </p>
          <p className="text-xl font-bold tracking-widest">
            {kills}/<span className="text-death-red">{deaths}</span>/{assists}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <p
          className={twMerge(
            'text-2xl font-bold tracking-widest',
            win ? 'text-victory-blue' : 'text-defeat-red'
          )}
        >
          {win ? 'Victory' : 'Defeat'}
        </p>
        <p className="text-sm font-bold">{formattedGameLength}</p>
        <p className="text-xs">
          {new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
}
