import { Button } from '../../components/Button';
import RoomCode from '../../components/RoomCode';
import { useParams } from 'react-router'

import '../../styles/room.scss';
import { FormEvent,  useContext,  useEffect,  useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { database } from '../../services/firebase';
import { Question } from '../../components/Question';
import { useRoom } from '../../hooks/useRoom';
import { useHistory } from 'react-router-dom';
import { DisplaySpanContext} from '../../context/DisplaySpanContext';
import toast, { Toaster } from 'react-hot-toast';
import { ChangeLogo } from '../../components/ChangeLogo';
import ToggleTheme from '../../components/ToggleTheme';

type RoomParams = {
    id:string;
}

export function Room(){
    const history = useHistory()
    const { user } = useAuth();
    const { itContainsAdmin } = useContext(DisplaySpanContext)
    const params = useParams<RoomParams>()
    const roomId = params.id;
    const { questions, title, theme } = useRoom(roomId)
    const [ toggleChanges, setToggleChanges ] = useState('')

    const [newQuestion, setNewQuestion] = useState('')

   async function handleSendQuestion(event:FormEvent) {
        event.preventDefault();
        if(newQuestion.trim() === ''){
            return;
        }

        if(!user){
            throw new Error('Unauthenticated')
        }

        const question = {
            content:newQuestion,
            author:{
                name:user.name,
                avatar:user.avatar,
            },
            isHightLighted:false,
            isAnswered:false,
        }

        await database.ref(`rooms/${roomId}/questions`).push(question);
        setNewQuestion('')

    }

    async function handleLikes(questionId:string, likeId?:string) {
        if(likeId){
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove()
        } else {
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
               authorId:user?.id
           })
        }
    }

    function handleRoomCode(){
        navigator.clipboard.writeText(roomId)
        toast.success('Copiado!!', {
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

    useEffect(()=> {
        setToggleChanges(theme)
    }, [theme])

    async function handleSaveTheme (){
        setToggleChanges(toggleChanges === 'white' ? 'black' : 'white')
        await database.ref(`rooms/${roomId}`).update({
            theme:toggleChanges === 'white' ? 'black' : 'white',
        })
    }



    return(
        <>

            {theme && <div className={`page-room ${theme === 'white' ? '' : 'dark'}`}>
                <header>
                    <div>
                        <Toaster
                        position="top-center"
                        reverseOrder={true}
                        />
                    </div>

                    <div className='content'>
                        <ChangeLogo onClick={()=> history.push('/')} theme={theme}/>
                        <RoomCode 
                        styleButton={{alignSelf:itContainsAdmin ? 'none' : 'start'}} 
                        styleSpan={{display:itContainsAdmin ? 'none' : 'block'}} 
                        onClick={handleRoomCode} 
                        code={roomId}/>
                    </div>
                </header>

                

                <main className='content'>
                    <div className='room-title'>
                        <div style={{justifyContent:questions.length === 0 ? 'end' : ''}}>
                            {questions.length > 0 &&  <span>{questions.length > 1 ? `${questions.length} perguntas` : `1 pergunta`}</span>}
                            <ToggleTheme theme={toggleChanges} onClick={handleSaveTheme}/>
                        </div>
                        <div className='title'>
                            <h1>Sala: </h1> <p> {title}</p>
                        </div>
                    </div>
                    <form onSubmit={handleSendQuestion}>
                        <textarea placeholder='O que você quer perguntar?'
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                        />
                        <div className='form-footer'>
                            {user ? (
                                <div className='user-info'>
                                    <img src={user.avatar} alt={user.name} />
                                    <span>{user.name}</span>
                                </div>
                            ) : (
                                <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
                            )}
                            <Button type='submit' disabled={!user}>Enviar perguntas</Button>
                        </div>
                    </form>

                    <div className="question-list">
                        {questions.map((question) => {
                            return (
                                <Question 
                                key={question.id} 
                                content={question.content} 
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHightLighted={question.isHightLighted}
                                >
                                    {!question.isAnswered  && 
                                    <button onClick={() => handleLikes(question.id, question.likeId)}className={`like-button ${question.likeId ? 'liked' : ''}`}>
                                        {question.likeCount > 0 && <span>{question.likeCount}</span>}
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>}
                                </Question>
                            )
                        })}
                    </div>
                </main>

            </div>}
        </>
    )

}