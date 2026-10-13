import { Mascot as PageMascot } from 'page-mascot';

// Maskot interaktif (page-mascot) di pojok kiri bawah.
// Sheet arah & ekspresi disimpan di public/mascots.
export default function Mascot() {
  return (
    <div className="mascot">
      <PageMascot
        directions="/mascots/cap-directions.webp"
        reactions="/mascots/cap-reactions.webp"
        label="mascot"
        size={110}
      />
    </div>
  );
}