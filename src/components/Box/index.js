import styled from 'styled-components';

const Box = styled.div`
  background: #fff;
  border-radius: 8px;

  input {
    width: 100%;
    background-color: #F4F4F4;
    color: #333;
    border: 0;
    margin-bottom: 14px;
    border-radius: 100000px;
    ::placeholder {
      color: #333;
      opacity: 1;
    }
  }

  button {
    border: 0;
    padding: 8px 12px;
    color: #FFF;
    border-radius: 10000px;
    background-color: #6F92BB;
  }
`;

export default Box;
