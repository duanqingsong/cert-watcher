
import LoginForm from './LoginForm';

const Login=(props)=> {
  // eslint-disable-next-line no-unused-vars
  const {searchParams,params} = props;

  return (<>
    <div className='text-2xl font-medium py-3'>HTTPS 证书监控</div>
    <LoginForm searchParams={searchParams} />
    </>
  )
}
export default Login
