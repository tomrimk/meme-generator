import { useLoaderData } from 'react-router-dom';
import { Meme } from '../types/Meme';
import Gallery from '../components/Gallery/Gallery';
import Header from '../components/Header/Header';
import { MemesContext } from '../contexts/memes-context';
import Search from '../components/Search/Search';

export async function loader(): Promise<{ memes: Meme[] }> {
  const { data } = await fetch('https://api.imgflip.com/get_memes', {
    method: 'GET',
  }).then((res) => res.json());

  return { memes: data.memes };
}

export default function Root() {
  const { memes } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <div className='App'>
      <MemesContext.Provider value={memes}>
        <Header actions={<Search />} />
        <Gallery />
      </MemesContext.Provider>
    </div>
  );
}
