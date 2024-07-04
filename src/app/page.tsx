import Head from 'next/head';
import WhacAMole from '../../component/whacamole';
import "./globals.css"; // Ensure Tailwind is included

export default function Home() {
  return (
    <div>
      <Head>
        <title>Whac a Mole</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <WhacAMole />
    </div>
  );
}