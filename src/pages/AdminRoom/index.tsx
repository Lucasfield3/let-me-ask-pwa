import deleteIcon from '../../assets/images/delete.svg';
import checkIcon from '../../assets/images/check.svg';
import answerIcon from '../../assets/images/answer.svg';
import emptyIcon from '../../assets/images/empty.svg';
import { Button } from '../../components/Button';
import RoomCode from '../../components/RoomCode';
import { useHistory, useParams } from 'react-router'

import '../../styles/room.scss';
//import useAuth from '../../hooks/useAuth';
import { Question } from '../../components/Question';
import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';
import ToggleTheme from '../../components/ToggleTheme';
import { useEffect, useState } from 'react';
import { ChangeLogo } from '../../components/ChangeLogo';

type RoomParams = {
    id:string;
}

export function AdminRoom(){
    //const { user } = useAuth();
    const history = useHistory()
    const params = useParams<RoomParams>()
    const roomId = params.id;
    const { questions, title, theme } = useRoom(roomId)
    const [ toggleChanges, setToggleChanges ] = useState('')
    
    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update({
            endedAt:new Date()
        })
        history.push('/')
    }

    async function handleDeleteQuestion(questionId:string){
        if(window.confirm('Você tem certeza que deseja deletar essa pergunta?')){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    async function handleCheckQuestionAsHighlighted(questionId:string){
       
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
                isHightLighted:true,
            })
        
    }

    async function handleCheckQuestionAsAnswered(questionId:string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered:true,
        })
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

    // async function handleLoadingPage(){

    // }
    
    return(
        <>
        {toggleChanges && 
       
        <div  className={`page-room ${toggleChanges === 'white' ? '' : 'dark'}`}>
             <header>
                 <div className='content'>
                     <ChangeLogo onClick={()=> history.push('/')} theme={toggleChanges}/>
                     <div className='header-content'>
                         <RoomCode code={roomId}/>
                         <Button onClick={handleEndRoom} isOutlined>Encerrar Sala</Button>
                     </div>
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
                                 
                                 {!question.isAnswered && (
                                     <>
                                         <button type='button' onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                                         <img src={checkIcon} alt="pergunta em destaque" />
                                         </button>
                                         <button type='button' onClick={() => handleCheckQuestionAsHighlighted(question.id)}>
                                             <img src={answerIcon} alt="pergunta respondida" />
                                         </button>
                                     </>
                                 )}
                                 <button type='button' onClick={() => handleDeleteQuestion(question.id)}>
                                     <img src={deleteIcon} alt="deletar pergunta" />
                                 </button>
                             </Question>
                         )
                     })}
                 </div>
                 {questions.length === 0 && (
                     <div className="empty-room">
                         <img src={emptyIcon} alt="no question" />
                         <strong>Nenhuma pergunta por aqui...</strong>
                         <p>Envie o código desta sala para seus amigos e começe a responder perguntas.</p>
                     </div>
                 )}
             </main>
 
         </div>}
        </>
    )

}