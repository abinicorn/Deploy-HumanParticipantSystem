import './styles/App.css';
import SessionContextProvider from './providers/SessionContextProvider';
import Login from "./pages/LoginPage";
import React from "react";
import StudyParticipantProvider from './providers/StudyPaticipantsProvider'
import ResearcherManagePopup from './components/Researcher/ResearcherManagePopup';
import {StudyResearcherContextProvider} from './providers/StudyResearcherContextProvider';
import CreateStudyPage from './pages/CreateStudyPage';
import { CurrentUserContextProvider } from './providers/CurrentUserProvider';
import ResearcherDashboardPage from './pages/ResearcherDashboardPage';
import ResearcherProfilePage from './pages/ResearcherProfilePage';
import { AuthenticationRedirect } from './utils/AuthenticationRedirect'
import { useRoutes } from "react-router-dom";
import SingleStudyPage from './pages/SingleStudyPage';
import ErrorPage from './pages/ErrorPage';

function App() {

  const MainLayout = ({children}) => {
    return(
      <AuthenticationRedirect>
        <CurrentUserContextProvider>
          {children}
        </CurrentUserContextProvider>
      </AuthenticationRedirect>
    )
  }
  
  const router = useRoutes([
    
    {
      path: '/',
      element: <Login/>
    },
    {
      path: '/homepage',
      element: (
        <MainLayout>
          <ResearcherDashboardPage/>
        </MainLayout>
      )
    },
    {
      path: '/researcher/profile',
      element: (
        <MainLayout>
          <ResearcherProfilePage/>
        </MainLayout>
      )
    },
    {
      path: '/studyInfo/:studyId',
      element: (
        <MainLayout>
          <StudyResearcherContextProvider>
            <StudyParticipantProvider>
              <SessionContextProvider>
                <SingleStudyPage/>
              </SessionContextProvider>
            </StudyParticipantProvider>
          </StudyResearcherContextProvider>        
        </MainLayout>
      )
    },
    {
      path: '/studyDetail',
      children: [
        {
          path: 'create',
          element: 
            <MainLayout>
              <CreateStudyPage/>
            </MainLayout>
        }, 
        {
          path: ':studyId/researcher',
          element: 
          <MainLayout>
            <StudyResearcherContextProvider>
              <ResearcherManagePopup/>
            </StudyResearcherContextProvider>
          </MainLayout>
        },
        ]
    },
    {
      path: '*',
      element:
        <MainLayout>
          <ErrorPage/>
        </MainLayout>
    }
  ]);

    return router;
}

export default App;
