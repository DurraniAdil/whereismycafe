import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F8F6F1] pb-10">
      <img
        src={`${import.meta.env.BASE_URL}media/footer.png`}
        alt="Where Is My Cafe?"
        className="w-full mx-auto"
      />
    </footer>
  );
};
