import Board from '@/components/board/board';
import { BoardProvider } from '@/contexts/board-context';

export default function Home() {
  return (
    <BoardProvider>
      <main className="h-screen_or_h-svh flex flex-col">
        <Board />
      </main>
    </BoardProvider>
  );
}
