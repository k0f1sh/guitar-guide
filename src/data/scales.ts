export interface ScaleDefinition {
  name: string;
  intervals: number[];
  degrees: string[];
}

export const SCALES: ScaleDefinition[] = [
  { name: 'メジャー', intervals: [0, 2, 4, 5, 7, 9, 11], degrees: ['R', '2', '3', '4', '5', '6', '7'] },
  { name: 'ナチュラルマイナー', intervals: [0, 2, 3, 5, 7, 8, 10], degrees: ['R', '2', 'b3', '4', '5', 'b6', 'b7'] },
  { name: 'メジャーペンタトニック', intervals: [0, 2, 4, 7, 9], degrees: ['R', '2', '3', '5', '6'] },
  { name: 'マイナーペンタトニック', intervals: [0, 3, 5, 7, 10], degrees: ['R', 'b3', '4', '5', 'b7'] },
  { name: 'ブルーススケール', intervals: [0, 3, 5, 6, 7, 10], degrees: ['R', 'b3', '4', 'b5', '5', 'b7'] },
  { name: 'ドリアン', intervals: [0, 2, 3, 5, 7, 9, 10], degrees: ['R', '2', 'b3', '4', '5', '6', 'b7'] },
  { name: 'ミクソリディアン', intervals: [0, 2, 4, 5, 7, 9, 10], degrees: ['R', '2', '3', '4', '5', '6', 'b7'] },
];
