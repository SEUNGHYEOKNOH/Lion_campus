import React, { Children } from 'react'
import styled from 'styled-components'

const DefaltCard = ({children}) => {
  return <CardDesign>{children}</CardDesign>
}

const CardDesign = styled.div`
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 20px;
  width: 250px;
`;

export default DefaltCard;
