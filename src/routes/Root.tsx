import { useLoaderData } from 'react-router-dom';
import { Meme } from '../types/Meme';
import Gallery from '../components/Gallery/Gallery';
import Header from '../components/Header/Header';

export async function rootLoader(): Promise<{ memes: Meme[] }> {
  const { data } = await fetch('https://api.imgflip.com/get_memes', {
    method: 'GET',
  }).then((res) => res.json());

  return { memes: data.memes };
}

export default function Root() {
  const { memes } = useLoaderData() as Awaited<ReturnType<typeof rootLoader>>;

  return (
    <div className='App'>
      <Header />
      <Gallery memes={memes} />
    </div>
  );
}
