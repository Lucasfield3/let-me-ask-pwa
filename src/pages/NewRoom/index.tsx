import illustrationImage from '../../assets/images/illustration.svg';
import logoIcon from '../../assets/images/logo.svg';
import '../../styles/auth.scss';
import { Button } from '../../components/Button';
import { Link, useHistory } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { database } from '../../services/firebase';


export function NewRoom(){
    const [ newRoom, setNewRoom ] = useState('')
    const { user } = useAuth(); 
    const history = useHistory()
    async function handleCreateRoom(event:FormEvent){
        event.preventDefault();

        if(newRoom.trim() === ''){
            return
        }

        const roomRef =  database.ref('rooms')
        const firebaseRoom = await roomRef.push({
            title:newRoom,
            authorId: user?.id,
            theme:'white'
        })

        history.push(`/admin/rooms/${firebaseRoom.key}`)

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
                    <form onSubmit={handleCreateRoom}>
                        <input 
                        type='text'
                        placeholder='Nome da sala'
                        value={newRoom}
                        onChange={event => setNewRoom(event.target.value)}
                        />
                        <Button type='submit'>
                            Criar sala
                        </Button>
                    </form>
                    <p>Quer entrar em uma sala existente? <Link to='/'>clique aqui</Link></p>
                </div>
            </main>
        </div>
    )

}
