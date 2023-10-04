import { useLoaderData } from 'react-router-dom';
import { Meme } from '../types/meme';
import Gallery from '../components/Gallery/Gallery';
import { MemesContext } from '../contexts/memes-context';
import { getMemes } from '../services/meme-service';
import Hero from '../components/Hero/Hero';

export async function loader(): Promise<{ memes: Meme[] }> {
  return getMemes();
}

export default function Root() {
  const { memes } = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <div className='App'>
      <MemesContext.Provider value={memes}>
        <main>
          <Hero />
          <Gallery />
        </main>
      </MemesContext.Provider>
    </div>
  );
}
