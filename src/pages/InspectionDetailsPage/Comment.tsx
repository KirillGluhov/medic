import { Button, Col, Flex, Row, Tooltip, Typography } from "antd";
import { 
    columnStyle,
    biggerRight,
    smallRight,
    boldText,
    grayText,
    justGray,
    alignCenter,
    blueColorStyle,
    marginBottom1,
    displayFlex,
} from "../../styles/additionalStyles";
import React, { useState } from "react";
import { CommentModel } from "./CommentsWrapper";
import { changeFormatToDateAndTime } from "../../functions/smallFunctions";
import FormForCommentCreate from "./FormForCommentCreate";
import FormForRedactComment from "./FormForRedactComment";

interface CommentProps
{
    index: number,
    comment: CommentModel | null,
    specialityName?: string,
    consultationId: string,
    numberComments: number,
    repeatConsultation: () => void,
    messageSuccess: (value: string) => void,
    messageError: (value: string) => void,
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Comment: React.FC<CommentProps> = ({
    index, 
    comment, 
    specialityName,  
    consultationId, 
    numberComments,
    repeatConsultation,
    messageSuccess,
    messageError,
    isOpen,
    setIsOpen
}) =>
{
    const [answer, setAnswer] = useState(false);
    const [redactNow, setRedactNow] = useState(false)
    
    return (
    <Flex 
        style={{...columnStyle, marginLeft: `${index*20}px`, ...(displayFlex)}} 
        className={index >= 1 ? "LElement" : "" }
    >
        <Row style={smallRight} gutter={[5,5]}>
            <Col>
                <Typography style={boldText}>{comment?.author}</Typography>
            </Col>
            <Col>
                <Typography style={grayText}>{`(${specialityName ? specialityName.toLowerCase() : null})`}</Typography>
            </Col>
        </Row>
        {
            redactNow ? 
            <Row style={biggerRight} gutter={[5,5]}>
                <Col span={24}>
                    <FormForRedactComment 
                        textContent={comment?.content} 
                        commentId={comment?.id} 
                        messageSuccess={messageSuccess}
                        messageError={messageError}
                        repeatConsultation={repeatConsultation}
                        setRedactNow={setRedactNow}
                    />
                </Col>
            </Row> : 
            <Row style={biggerRight} gutter={[5,5]}>
                <Col>
                    <Typography>{comment?.content}</Typography>
                </Col>
                <Col>
                {(comment?.modifiedDate !== comment?.createTime) ? <Tooltip placement="topRight" title={comment?.modifiedDate ? changeFormatToDateAndTime(comment.modifiedDate) : null}>
                    <Typography style={justGray} className="onHover">(изменено)</Typography>
                </Tooltip> : null}
                </Col>
            </Row>
        }
        <Row style={{...smallRight, ...alignCenter}} className={answer ? "" : "downLineMain"}>
            <Col>
                <Typography style={{...justGray, ...marginBottom1}}>{comment?.createTime ? changeFormatToDateAndTime(comment.createTime) : null}</Typography>
            </Col>
            {(numberComments > 0) ? <Col>
                <Button 
                    type="link" 
                    style={blueColorStyle} 
                    onClick={() => {setIsOpen(!isOpen); console.log("IIIndex", index, "IIId", comment?.id)}}
                    size="small"
                >{isOpen ? `Скрыть комментарии` : `Показать все (${numberComments})`}</Button>
            </Col> : null}
            <Col>
                <Button 
                    type="link" 
                    style={blueColorStyle} 
                    size="small" 
                    onClick={() => {setAnswer(!answer)}}
                >Ответить</Button>
            </Col>
            {(localStorage.getItem("me") === comment?.authorId) ? <Col>
                <Button 
                    type="link" 
                    style={blueColorStyle} 
                    size="small" 
                    onClick={() => {setRedactNow(!redactNow)}}
                >Редактировать</Button>
            </Col> : null}
        </Row>
        {answer ? <Row className="downLineMainAdd">
            <Col span={24}>
                <FormForCommentCreate 
                    parentId={comment?.id} 
                    consultationId={consultationId}
                    setAnswer={setAnswer}
                    repeatConsultation={repeatConsultation}
                    messageSuccess={messageSuccess}
                    messageError={messageError}
                />
            </Col>
        </Row> : null}
    </Flex>);
}

export default Comment;