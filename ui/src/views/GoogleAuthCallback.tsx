import axios from 'axios';
import { memo, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface Auth {
    jwt: string;
    user: any;
}

export const GoogleAuthCallback = memo(() => {
    const [auth, setAuth] = useState<Auth>();
    const location = useLocation();

    useEffect(() => {
        if (!location) {
            return;
        }
        const { search } = location;

        axios({
            method: 'GET',
            url: `http://localhost:1337/api/auth/google/callback${search}`,
        })
            .then((res) => res.data)
            .then(setAuth);
    }, [location]);

    return (
        <div>
            {auth && (
                <>
                    <div>Jwt: {auth.jwt}</div>
                    <div>User Id: {auth.user.id}</div>
                    <div>Provider: {auth.user.provider}</div>
                </>
            )}
        </div>
    );
});

// http://localhost:3000/auth/google/callback?id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImZkYTEwNjY0NTNkYzlkYzNkZDkzM2E0MWVhNTdkYTNlZjI0MmIwZjciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI3NjE1MzgxMTUxMDYtNzZpOGQ5b3NpYzZqaGg2NzY5dTJ0dm1yaDRrOXFuaDIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI3NjE1MzgxMTUxMDYtNzZpOGQ5b3NpYzZqaGg2NzY5dTJ0dm1yaDRrOXFuaDIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDI5MDU1OTE0NDE2MjY4MzE4NzQiLCJlbWFpbCI6ImV2Z2FydC5raWV2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiSU01N0g0TURpSmc2VC11S29QcmFyQSIsImlhdCI6MTY2MDA3NTc0OSwiZXhwIjoxNjYwMDc5MzQ5fQ.jcezU4mq_nsudwOCwX0rNrW9G3yIkBWPgJq9CERMGEpKC1gTPCKCqaTpCMb1G-b5E0w-KJrGJo-NOjWbl-GxXGJUvx5gS3-S6nj6owv5XvWytuZHmXgDpX5aV2RNZkn_Oy4FaPhVgtQaSqVZ8Rbv-bCszOWh6KZRLvxp0TfKU5QVZ8ORQhbtADrjr9JPDwUP3VdU8x21I2IMO7NbS8N4CySJKOilvS-kn-e_rt-1poF0iaVYBL5gfmWicrPaE1wxerbwVkZjlt7LyKnXGTKqTEirRjbyy_iVC5C4yEf8tpBgQe_SvlEQ2MG3d_y8AlMNu9rRlOCcuSd136EUXf1lbw&access_token=ya29.A0AVA9y1vA_dxUWnun8waoFX20O2DLB320SGbLtm3XWmb-m20HGN8XB_QqkhlAx6dmzOc2oCbzWhEK7zYToES6jZAZ66UH2YXBFd2kEtCSt69WFFU4byhI1WtlrZ0FiPa-Ugb9H1kIfueMHILJxIcfFe7AkW0uaCgYKATASATASFQE65dr8Xhsj8VoaeYbSOMxG8ildng0163&raw%5Baccess_token%5D=ya29.A0AVA9y1vA_dxUWnun8waoFX20O2DLB320SGbLtm3XWmb-m20HGN8XB_QqkhlAx6dmzOc2oCbzWhEK7zYToES6jZAZ66UH2YXBFd2kEtCSt69WFFU4byhI1WtlrZ0FiPa-Ugb9H1kIfueMHILJxIcfFe7AkW0uaCgYKATASATASFQE65dr8Xhsj8VoaeYbSOMxG8ildng0163&raw%5Bexpires_in%5D=3599&raw%5Bscope%5D=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20openid&raw%5Btoken_type%5D=Bearer&raw%5Bid_token%5D=eyJhbGciOiJSUzI1NiIsImtpZCI6ImZkYTEwNjY0NTNkYzlkYzNkZDkzM2E0MWVhNTdkYTNlZjI0MmIwZjciLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI3NjE1MzgxMTUxMDYtNzZpOGQ5b3NpYzZqaGg2NzY5dTJ0dm1yaDRrOXFuaDIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI3NjE1MzgxMTUxMDYtNzZpOGQ5b3NpYzZqaGg2NzY5dTJ0dm1yaDRrOXFuaDIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDI5MDU1OTE0NDE2MjY4MzE4NzQiLCJlbWFpbCI6ImV2Z2FydC5raWV2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiSU01N0g0TURpSmc2VC11S29QcmFyQSIsImlhdCI6MTY2MDA3NTc0OSwiZXhwIjoxNjYwMDc5MzQ5fQ.jcezU4mq_nsudwOCwX0rNrW9G3yIkBWPgJq9CERMGEpKC1gTPCKCqaTpCMb1G-b5E0w-KJrGJo-NOjWbl-GxXGJUvx5gS3-S6nj6owv5XvWytuZHmXgDpX5aV2RNZkn_Oy4FaPhVgtQaSqVZ8Rbv-bCszOWh6KZRLvxp0TfKU5QVZ8ORQhbtADrjr9JPDwUP3VdU8x21I2IMO7NbS8N4CySJKOilvS-kn-e_rt-1poF0iaVYBL5gfmWicrPaE1wxerbwVkZjlt7LyKnXGTKqTEirRjbyy_iVC5C4yEf8tpBgQe_SvlEQ2MG3d_y8AlMNu9rRlOCcuSd136EUXf1lbw
