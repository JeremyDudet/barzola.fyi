import NextLink from 'next/link'
import Image from 'next/image'
import { useColorModeValue } from '@chakra-ui/react'
import barzolaBlack from '../../images/barzola-logo-black.png'
import barzolaWhite from '../../images/barzola-logo-white.png'
import styled from '@emotion/styled'

const LogoBox = styled.span`
  align-items: center;
  justify-content: center;
  width: 75px;
  height: 30px;
  display: inline-flex;
  margin-left: 10px;
  maring-top: 7px;
  margin-right: 4px;
  padding-top: 5px;
`

interface Props {
  onClose: () => void
}

const Logo = ({ onClose }: Props) => {
  return (
    <LogoBox>
      <NextLink href="/">
        <Image
          src={useColorModeValue(barzolaBlack, barzolaWhite)}
          alt="BarZola"
          style={{ cursor: 'pointer' }}
          onClick={onClose}
        />
      </NextLink>
    </LogoBox>
  )
}

export default Logo
