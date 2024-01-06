import { ChatPane } from '~/components/chat/panel';
import { ProfilePane } from '~/components/persona/panel';

export default function Home() {
  return (
    <main className="h-[calc(100vh-64px)] grid grid-cols-2 grid-rows-2 px-10 pb-10 gap-4">
      <ProfilePane className="col-span-1 row-span-2" />
      <ChatPane className="col-span-1 row-span-2" />
    </main>
  );
}
