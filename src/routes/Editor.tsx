import { Params, redirect, useLoaderData } from 'react-router-dom';
import Editor from '../components/Editor/Editor';
import { getMemes } from '../services/meme-service';
import { Meme } from '../types/meme';
import Header from '../components/Header/Header';

export async function loader({
  params,
}: {
  params: Params;
}): Promise<Meme | Response> {
  if (!params.templateName) {
    return redirect('/');
  }

  const { memes } = await getMemes();
  const selectedMeme = memes.find(
    (meme) => meme.name === decodeURI(params.templateName!),
  );

  if (!selectedMeme) {
    return redirect('/');
  }

  return selectedMeme;
}

export default function EditorRoute() {
  const selectedMeme = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  return (
    <>
      <Header />
      <Editor meme={selectedMeme as Meme} />
    </>
  );
}
