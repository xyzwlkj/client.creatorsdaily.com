import styled from 'styled-components'
import { Button, Col, Divider, Row } from 'antd'
import Link from 'next/link'
import media from '../libs/media'
import useCanEditProduct from '../hooks/useCanEditProduct'
import ProductLinks from './ProductLinks'
import ProductLike from './ProductLike'
import ProductUsers from './ProductUsers'
import WeChatButton from './WeChatButton'
import MiniProgram from './MiniProgram'

const Container = styled.div`
padding: 0 16px;
${media.md`
  margin-top: 104px;
`}
${media.sm`
  padding: 0;
`}
`

const StyledProductLike = styled(ProductLike)`
margin-bottom: 12px;
`

const StyledWeChatButton = styled(WeChatButton)`
  margin: 0 auto 24px;
  display: block;
`

export default ({ id, name, isMiniProgram, miniProgramQRCode, discovererId, isLike, likeCount, links = [], discoverer, creators = [] }) => {
  const canEdit = useCanEditProduct({ creators, discovererId })

  const renderButton = () => {
    if (!canEdit) return null
    return (
      <Row gutter={8} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Link href='/[id]/editor' as={`/${id}/editor`}>
            <a>
              <Button block icon='edit'>编辑</Button>
            </a>
          </Link>
        </Col>
        <Col span={8}>
          <Button block type='danger' icon='delete' disabled>删除</Button>
        </Col>
      </Row>
    )
  }
  const renderMiniProgram = () => {
    if (!isMiniProgram) return null
    return (
      <>
        <Divider orientation='left'>微信小程序</Divider>
        <MiniProgram hash={miniProgramQRCode && miniProgramQRCode.hash} />
      </>
    )
  }
  const renderWeChat = () => {
    if (!creators.length) {
      return (
        <StyledWeChatButton tooltip={`「${name}」暂无创造者，如果您是产品的创造者，请联系微信认领`}>
          认领产品
        </StyledWeChatButton>
      )
    }
  }

  return (
    <Container>
      {renderButton()}
      <StyledProductLike id={id} likeCount={likeCount} isLike={isLike} />
      <ProductLinks links={links} />
      {renderMiniProgram()}
      <ProductUsers discoverer={discoverer} creators={creators} />
      {renderWeChat()}
    </Container>
  )
}
