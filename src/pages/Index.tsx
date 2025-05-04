
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard
    navigate('/');
  }, [navigate]);

  // This is just a fallback but should not be visible
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Loading ActiveEdge CRM</h1>
        <p className="text-xl text-muted-foreground">Please wait...</p>
      </div>
    </div>
  );
};

export default Index;
