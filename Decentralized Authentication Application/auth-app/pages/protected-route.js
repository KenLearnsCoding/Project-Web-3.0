import withAuth from '../utils/withAuth'

function ProtectedRoute() {
    return <h1>This is the protected Route</h1>
}

export default withAuth(ProtectedRoute) ;