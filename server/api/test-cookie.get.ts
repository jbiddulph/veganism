export default defineEventHandler(async (event) => {
  console.log('🧪 Test cookie endpoint called')
  
  setCookie(event, 'test_cookie', 'test_value_123', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: 60 * 60 * 24
  })
  
  console.log('🧪 Test cookie set')
  console.log('🧪 Response headers:', getHeader(event, 'set-cookie'))
  
  return { message: 'Test cookie set' }
})
