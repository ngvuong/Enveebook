import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Enveebook</title>
        <meta name='description' content='A simple facebook clone' />
        <meta
          name='keywords'
          content='web development, nextjs, facebook clone, envee'
        />
        <link rel='icon' href='../public/favicon.ico' />
      </Head>
      <h1>Welcome to Enveebook!</h1>
      <p>
        A new but familiar social networking community. Connect with old friends
        and meet new ones. Browse and share your interests and stories.
      </p>
    </div>
  );
}
