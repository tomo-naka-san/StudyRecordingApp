//FireBaseとgithubが連携しているか確認
import { useState, useEffect } from "react";
import { Button, Flex } from "@chakra-ui/react";
import { supabase } from "./db/supabaseClient";

function App() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title,   setTitle]   = useState("");
    const [time,    setTime]    = useState("");
    const [error,   setError]   = useState("");
    const totalTime = records.reduce((sum, record) => sum + record.time, 0);

    const handleOnChangeTitle = (e) => {
        setTitle(e.target.value);
    };

    const handleOnChangeTime = (e) => {
        setTime(e.target.value);
    } 

    //supabase DBからデータを取得
    const fetchRecords = async () => {
        setLoading(true);
        const {data, error} = await supabase
                                    .from('study-records')
                                    .select('*');
                                    
        if(error){
            console.error("データ取得中にエラー発生", error.message);
            setError("データの取得に失敗しました。");
        }else{
            setRecords(data || []);
        }
        setLoading(false);
    };

    //初回のレンダリング時にDBのデータを取得
    useEffect(() => {
        fetchRecords()
    }, []);

    //supabase DB operations (INSERT INTO study-records(title, time) SET (param))
    const handleOnClickRegist = async (e) => { 
        e.preventDefault();

        if(!title.trim() || !time){
            setError("すべての項目を入力してください。");
            return;
        }

        const {error} = await supabase
                              .from('study-records')
                              .insert({title, time: parseInt(time)});
        if(error){
            console.error("データ登録中にエラー発生", error.message);
            setError("データの登録処理に失敗しました。");
            return;
        }

        await fetchRecords();
    
        setTitle("");
        setTime("");
        setError("");       
    };

    //supabase DB operations (DELETE FROM study-records where id = param)
    const handleOnClickDelete = async (id) => {
        const {error} = await supabase
                              .from('study-records')
                              .delete()
                              .eq('id', id);
        if(error){
            console.error("データ登録中にエラー発生", error.message);
            setError("データの削除に失敗しました。");
            return;
        }
        await fetchRecords();    
    };

    if(loading){
        return <div>Loading......</div>
    }

    return (
        <>
        <h1>学習記録一覧</h1>
        <Flex alignItems='center' justifyContent='center'>
                <div>
                    <h2>入力フォーム</h2>
                    <div>
                        <label>学習記録：</label><input type="text" value={title} onChange={handleOnChangeTitle} placeholder="例 プログラミング"/>
                    </div>
                    <div>
                        <label>学習時間：</label><input type="number" value={time} onChange={handleOnChangeTime} placeholder="例 2"/>
                    </div>
                    {error !== "" && <p style={{color: "red"}}>{error}</p>}
                    <Button colorScheme="teal" m='1' onClick={handleOnClickRegist}>登録</Button>         
                <h1>学習記録</h1>
                <table border='1'>
                    <tbody>
                        <tr>
                            <th>学習内容</th>
                            <th>学習時間</th>
                        </tr>
                        {records.map((record, index) => (
                            <tr>
                                <td key={index}>{record.title}</td>
                                <td key={index}>{record.time}時間</td>
                                <td><Button colorScheme="teal" m='1' onClick={() => handleOnClickDelete(record.id)}>削除</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    <p>総学習時間：{totalTime}時間</p>
                </div>
            </div>
        </Flex>
        </>
    )
}

export default App;
