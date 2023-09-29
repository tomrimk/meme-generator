import { Params, redirect, useLoaderData } from 'react-router-dom';
import Editor from '../components/Editor/Editor';
import { getMemes } from '../services/meme-service';
import { Meme } from '../types/Meme';

export async function loader({
  params,
}: {
  params: Params;
}): Promise<Meme | undefined> {
  if (!params.templateName) {
    return;
  }

  const { memes } = await getMemes();
  const selectedMeme = memes.find(
    (meme) => meme.name === decodeURI(params.templateName!),
  );

  return selectedMeme;
}

export default function EditorRoute() {
  const selectedMeme = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  if (!selectedMeme) {
    redirect('/');

    return null;
  }

  return <Editor meme={selectedMeme} />;
}
