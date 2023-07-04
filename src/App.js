import { useEffect, useState } from "react";
import "./App.css";
// import axios from "axios";
import api from "./axios/api";

function App() {
  const [todos, setTodos] = useState(null);
  const [inputValue, setInputValue] = useState({
    title: "",
  }); // id는 자동으로 입력된다.
  const [targetId, setTargetId] = useState("");
  const [contents, setContents] = useState("");
  const fetchTodos = async () => {
    const { data } = await api.get("/todos");
    // console.log(data);
    setTodos(data);
  };
  // 추가
  const onSubmitHandler = async (newTodo) => {
    api.post("/todos", inputValue);
    // setTodos([...todos, inputValue]); // 렌더링을 위해
    // 추가하면 id를 읽어오지 못하고 있다.
    fetchTodos(); // db 갱신
  };

  // 삭제
  const onDeleteButtonClickHandler = async (id) => {
    api.delete(`/todos/${id}`);
    setTodos(
      todos.filter((item) => {
        return item.id !== id;
      })
    );
  };

  // 수정
  const onUpdateButtonClickHandler = async () => {
    api.patch(`/todos/${targetId}`, {
      title: contents,
    });
    setTodos(
      todos.map((item) => {
        if (item.id === parseInt(targetId)) {
          return { ...item, title: contents };
        } else {
          return item;
        }
      })
    );
  };

  useEffect(() => {
    // db로 부터 값을 가져와야 한다.
    fetchTodos();
  }, []);

  return (
    <>
      <div>
        {/* 수정 영역 */}
        <input
          type="text"
          placeholder="수정할 아이디"
          value={targetId}
          onChange={(e) => {
            setTargetId(e.target.value);
          }}
        />
        <input
          type="text"
          placeholder="수정할 내용"
          value={contents}
          onChange={(e) => {
            setContents(e.target.value);
          }}
        />
        <button onClick={() => onUpdateButtonClickHandler()}>수정</button>
        <br />
        <br />
      </div>
      <div>
        {/* input 영역 */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // 버튼 클릭 시, input에 들어있는 값을 이용하여 DB에 저장(post)
            onSubmitHandler();
          }}
        >
          <input
            type="text"
            value={inputValue.title}
            onChange={(e) => {
              setInputValue({
                title: e.target.value,
              });
            }}
          />
          <button>추가</button>
        </form>
      </div>
      <div>
        {/* data 영역 */}
        {todos?.map((item) => {
          return (
            <div key={item.id}>
              {item.id} : {item.title}
              &nbsp;
              <button onClick={() => onDeleteButtonClickHandler(item.id)}>
                삭제
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
