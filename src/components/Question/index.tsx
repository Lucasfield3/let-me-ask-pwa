
import { ReactNode } from 'react'
import './style.scss'
import cx from 'classnames'

type QuestionProps = {
    content:string;
    author:{
        name:string;
        avatar:string;
    };
    isHightLighted?:boolean;
    isAnswered?: boolean;
    children?:ReactNode;
}
export function Question({ content, author, children, isHightLighted = false, isAnswered = false}:QuestionProps){

    return(
        <div className={
            cx('question', 
            { answered: isAnswered }, 
            { hightlighted: isHightLighted && !isAnswered })
            }>
            <p>{content}</p>
            <footer>
                <div  className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                <div>{children}</div>
            </footer>
        </div>
    )

}