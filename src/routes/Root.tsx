import { useLoaderData } from 'react-router-dom';
import { Meme } from '../types/meme';
import Gallery from '../components/Gallery/Gallery';
import Header from '../components/Header/Header';
import { MemesContext } from '../contexts/memes-context';
import Search from '../components/Search/Search';
import { getMemes } from '../services/meme-service';

export async function loader(): Promise<{ memes: Meme[] }> {
  return getMemes();
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
