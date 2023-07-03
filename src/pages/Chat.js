import React from 'react';
import { Container,Row,Col } from 'react-bootstrap';
import Sidebar from '../components/Sidebar';
import MessageForm from '../components/MessageForm';
import './chat.css';

function Chat() {
  return (
   
    <Row className='chat_bg' >
 
      <Col  md={3}>
        <Sidebar/>
      </Col>

      <Col md={7}>
      <MessageForm/>
      </Col>
      <Col  md={2}>
        
      </Col>
    </Row>
  )
}

export default Chat