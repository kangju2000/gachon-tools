import { useState } from 'react';

function App() {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const onButtonClick = () => {
    setIsClicked(prev => !prev);
  };

  return (
    <div className="w-[400px] h-[300px] bg-[#eee] p-[10px]">
      <p className="text-2xl text-center">가천대학교 플러그인</p>
      
      <button onClick={onButtonClick}>클릭!</button>
      {isClicked && <div className="w-[30px] h-[30px] bg-black"></div>}
    </div>
  );
}

export default App;
