import { ButtonHTMLAttributes, CSSProperties } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import copyImg from '../../assets/images/copy.svg';

import './style.scss';

type RoomCodeProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    code:string;
    styleButton?:CSSProperties;
    styleSpan?:CSSProperties;
}

export function RoomCode({styleButton, code, styleSpan}: RoomCodeProps){

    function handleRoomCode(){
        navigator.clipboard.writeText(code)
        toast.success('Código da sala copiado!!', {
            style: {
              border: '1px solid #835afd',
              padding: '16px',
              color: '#29292e',
              fontFamily:'Poppins'
            },
            iconTheme: {
              primary: '#835afd',
              secondary: '#FFFAEE',
            },
          });
    }

    
    return(
            <>
                <Toaster
                position="top-center"
                reverseOrder={true}
                />
                <button style={styleButton} onClick={handleRoomCode} title='Copy room code' className='room-code'>
                    <div>
                        <img src={copyImg} alt="Copy room code" />
                    </div>
                    <span style={styleSpan}>Sala {code}</span>
                </button>
            </>
    )

}

export default RoomCode 