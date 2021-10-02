import './style.scss';

type ToggleProps = {
    theme:string;
    onClick:()=> void;
}

export function ToggleTheme({theme, onClick}:ToggleProps){
    
    return(
            <>
                <div 
                style={{background:theme === 'white' ? 'white' : 'black',  
                transition:'background 0.2s ease'}} 
                onClick={onClick} 
                className="toggle">
                    <span style={{background:theme === 'white' ? 'black' : 'white', 
                    marginLeft:theme !== 'white'  ? '1.8rem' : '0', 
                    transition:'all 0.2s linear'}}></span>
                </div>
            </>
    )

}

export default ToggleTheme 