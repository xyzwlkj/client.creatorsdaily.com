import styled from 'styled-components'
import { useQuery } from '@apollo/react-hooks'
import { useState } from 'react'
import { Affix, Col, Row, Spin } from 'antd'
import get from 'lodash/get'
import Link from 'next/link'
import Head from 'next/head'
import Page from '../layouts/Page'
import Container from '../components/Container'
import { GET_COMMENTS } from '../queries'
import CommentsBox from '../components/CommentsBox.dynamic'
import ProductCell from '../components/ProductCell'
import { ProductContainer } from '../components/Product'
import withApollo from '../libs/with-apollo'
import MoreButton from '../components/MoreButton'

const StyledContainer = styled(Container)`
margin: 24px auto;
`

const StyledProductCell = styled(ProductCell)`
border: 0px;
box-shadow: none;
margin-bottom: 16px;
:hover {
  border: 0px;
}
a {
  padding: 0;
}
`

const Tip = styled.h1`
  font-size: 32px;
  color: rgba(0,0,0,0.1);
  text-align: center;
  line-height: 400px;
`

export default withApollo(() => {
  const size = 10
  const [hoverProduct, setHoverProduct] = useState()
  const [focusProduct, setFocusProduct] = useState()
  const query = [GET_COMMENTS, {
    size
  }]
  const [page, setPage] = useState(1)
  const { data, loading, fetchMore } = useQuery(query[0], {
    variables: query[1],
    notifyOnNetworkStatusChange: true
  })
  const list = get(data, 'getComments.data', [])
  const total = get(data, 'getComments.total', 0)
  const renderProduct = () => {
    if (!hoverProduct && !focusProduct) {
      return (
        <Tip>快来和创造者们聊聊</Tip>
      )
    }
    return (
      <ProductContainer id={hoverProduct || focusProduct} full />
    )
  }
  const handleFetchMore = () => {
    fetchMore({
      variables: {
        page: page + 1
      },
      updateQuery (prev, { fetchMoreResult }) {
        if (!fetchMoreResult) return prev
        setPage(page + 1)
        return {
          ...prev,
          getComments: {
            ...prev.getComments,
            data: [
              ...prev.getComments.data,
              ...fetchMoreResult.getComments.data
            ]
          }
        }
      }
    })
  }
  const renderMore = () => {
    if (page * size >= total) return null
    return (
      <MoreButton size='small' type='link' block loading={loading} onClick={handleFetchMore}>加载更多</MoreButton>
    )
  }
  return (
    <Page>
      <Head>
        <title>聊产品 - {process.env.NAME}</title>
        <meta key='description' name='description' content='快来和各位创造者们聊一聊～' />
      </Head>
      <StyledContainer>
        <Row gutter={24}>
          <Col md={12} xs={24}>
            <Spin spinning={loading}>
              {list.map(x => {
                const product = x.products[0] || {}
                return (
                  <CommentsBox
                    key={x.id}
                    onFocus={() => setFocusProduct(product.id)}
                    onBlur={() => setFocusProduct(null)}
                    onMouseEnter={() => setHoverProduct(product.id)}
                    onMouseLeave={() => setHoverProduct(null)}
                    list={[x]}
                    renderHeader={() => (
                      <StyledProductCell {...product} size='small' />
                    )}
                    renderFooter={() => (
                      <Link href='/[id]' as={`/${product.id}#comments`}>
                        <a>
                          <MoreButton size='small' type='link' block>更多「{product.name}」的评论</MoreButton>
                        </a>
                      </Link>
                    )}
                    query={query}
                    loading={loading}
                    product={product}
                    productId={product.id}
                  />
                )
              })}
              {renderMore()}
            </Spin>
          </Col>
          <Col md={12} xs={0}>
            <Affix offsetTop={24}>
              {renderProduct()}
            </Affix>
          </Col>
        </Row>
      </StyledContainer>
    </Page>
  )
})
