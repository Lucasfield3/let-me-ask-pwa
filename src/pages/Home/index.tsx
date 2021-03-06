import illustrationImage from '../../assets/images/illustration.svg';
import logoIcon from '../../assets/images/logo.svg';
import googleIcon from '../../assets/images/google-icon.svg';
import '../../styles/auth.scss';
import { Button } from '../../components/Button';
import { useHistory } from 'react-router';
import useAuth from '../../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { database } from '../../services/firebase';

export function Home(){
    const history = useHistory()
    const { user, signInWithgoogle } = useAuth()
    const [ roomCode, setRoomCode ] = useState('')
    async function handleSignIn() {
        if(!user){
            await signInWithgoogle()
        }

        history.push('rooms/new')
    }

    async function handleJoinRoom(event:FormEvent){
        event.preventDefault();

        if(roomCode.trim() === ''){
            return;
        }

        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if(!roomRef.exists()){
            alert('Room does not exist.');
            return;   
        }

        if(roomRef.val().endedAt){
            alert('Room already closed.');
            return; 
        }
    
        history.push(`/rooms/${roomCode}`);
        
    }
    

    return(
        <div id='page-auth'>
            <aside>
                <img src={illustrationImage} alt='perguntas e respostas'></img>
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas de sua audiência em tempo real</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logoIcon} alt='let me ask'/>
                    <button onClick={handleSignIn} className='create-room'>
                        <img src={googleIcon} alt='google'/>
                        Crie sua sala com o google
                    </button>
                    <div className='separator'>ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                        type='text'
                        placeholder='código da sala'
                        value={roomCode}
                        onChange={event => setRoomCode(event.target.value)}
                        />
                        <Button type='submit'>
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )

}
