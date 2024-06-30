import { Typography, message } from "antd";
import { styleForCommentary } from "../styles/additionalStyles";
import Comment from "./Comment";
import { InspectionConsultationModel } from "./DetailsInspection";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../const/constValues";

type SpecialityModel = {
    id: string,
    createTime: string,
    name: string
}

export type CommentModel = {
    id: string,
    createTime: string,
    modifiedDate?: string,
    content: string,
    authorId: string,
    author: string,
    parentId?: string
}

export type ConsultationModel = {
    id: string,
    createTime: string,
    inspectionId?: string,
    speciality?: SpecialityModel,
    comments?: CommentModel[]
}

interface CommentsWrapperProps
{
    consultation: InspectionConsultationModel
}

const CommentsWrapper: React.FC<CommentsWrapperProps> = ({consultation}) =>
{
    const [commentsInfo, setCommentsInfo] = useState<ConsultationModel | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const messageSuccess = (value: string) => {
        message.success(value);
    }

    const messageError = (value: string) => {
        message.error(value);
    }

    const repeatConsultation = () => {
        axios.get(baseUrl + `consultation/${consultation.id}`, 
            { 
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                } 
            }
        )
        .then(response => {
            console.log(response);
            setCommentsInfo(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    }

    useEffect(() => {
        axios.get(baseUrl + `consultation/${consultation.id}`, 
            { 
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem("token")}` 
                } 
            }
        )
        .then(response => {
            console.log(response);
            setCommentsInfo(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    },[consultation])


    return (<>
    <Typography style={styleForCommentary}>Комментарии</Typography>
    {
        commentsInfo && commentsInfo.comments && commentsInfo.comments.map((comment, index) => (
            <Comment 
                index={index} 
                comment={comment} 
                specialityName={commentsInfo?.speciality?.name} 
                numberComments={commentsInfo.comments?.length}
                changeOpen={setIsOpen}
                isOpen={isOpen}
                consultationId={commentsInfo.id}
                repeatConsultation={repeatConsultation}
                messageSuccess={messageSuccess}
                messageError={messageError}
            />
        ))
    }
    </>)
}

export default CommentsWrapper;