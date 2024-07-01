import React, { useState } from "react";
import { CommentModel } from "./CommentsWrapper";
import Comment from "./Comment";

interface ComentsWrapperInnerProps
{
    index: number,
    comments: CommentModel[],
    comm: CommentModel,
    messageSuccess: (value: string) => void,
    messageError: (value: string) => void,
    repeatConsultation: () => void,
    consultationId: string,
    specialityName?: string
}

const ComentsWrapperInner: React.FC<ComentsWrapperInnerProps> = (
    {
        index, 
        comments, 
        comm, 
        messageSuccess,
        messageError,
        repeatConsultation,
        consultationId,
        specialityName
    }
) =>
{
    const [isOpen, setIsOpen] = useState(false);

    return (<>
        {<Comment 
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            index={index} 
            comment={comm} 
            specialityName={specialityName} 
            numberComments={comments.filter(comme => comme.parentId === comm.id).length}
            consultationId={consultationId}
            repeatConsultation={repeatConsultation}
            messageSuccess={messageSuccess}
            messageError={messageError}
        /> }
        {isOpen &&
            comments.filter(comme => comme.parentId === comm.id).map((comme) => (
                <ComentsWrapperInner 
                    comm={comme}
                    index={index+1} 
                    comments={comments} 
                    messageSuccess={messageSuccess}
                    messageError={messageError}
                    repeatConsultation={repeatConsultation}
                    consultationId={consultationId}
                    specialityName={specialityName} 
                />
            ))
        }
    </>);
}

export default ComentsWrapperInner;