import React, { FormEvent, useState } from "react";
import * as EmailValidator from "email-validator";
import { Tooltip } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";

import LogoImg from "../images/logo.png";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

import "../styles/pages/login.css";

const Login = () => {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showInputPass, setShowInputPass] = useState(false);

  const msgSwal = (title: any, html: any, icon: any, timer: any) => {
    Swal.fire({
      title: title,
      html: html,
      icon: icon,
      timer: timer,
      confirmButtonText: "OK",
    });
  };

  const handleEmail = (e: FormEvent) => {
    e.preventDefault();

    let inpEmail = document.getElementById("email-form")?.querySelector("input");

    if (
      inpEmail?.classList.contains("error") ||
      email.length <= 0 ||
      !EmailValidator.validate(email)
    ) {
      msgSwal("Aviso", "Campo <strong>EMAIL</strong> inválido", "error", 0);
      return;
    } else {
      setShowPass(true);
      setTimeout(() => {
        document.getElementById("pass-form")?.querySelector("input")?.focus();
      }, 500);
    }
  };

  const handlePass = (e: FormEvent) => {
    e.preventDefault();

    let inpEmail = document.getElementById("email-form")?.querySelector("input");
    let inpPass = document.getElementById("pass-form")?.querySelector("input");

    if (
      inpEmail?.classList.contains("error") ||
      email.length <= 0 ||
      !EmailValidator.validate(email)
    ) {
      msgSwal("Aviso", "Campo <strong>EMAIL</strong> inválido", "error", 0);
      return;
    }

    if (
      inpPass?.classList.contains("error") ||
      password.length <= 0 ||
      (password.length >= 1 && password.length <= 5)
    ) {
      msgSwal("Aviso", "Campo <strong>SENHA</strong> inválido", "error", 0);
      return;
    } else {
      goToNext("main");
    }
  };

  const goToNext = (url: String) => {
    document.getElementById("f-box")?.classList.add("next");
    let change = setTimeout(() => {
      history.push(`/${url}`);
    }, 500);
    return () => clearTimeout(change);
  };

  const returnLink = () => {
    let elem = document.getElementById("pass-form")?.parentElement;
    elem?.classList.remove("is-flipped");
    setShowPass(false);
    setEmail("");
    setPassword("");
  };

  const recoverPass = () => {
    Swal.fire({
      title: "Recuperação de senha",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
        placeholder: "Insira seu email",
      },
      showCancelButton: true,
      confirmButtonText: "Enviar",
      cancelButtonText: "Cancelar",
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      allowEscapeKey: () => !Swal.isLoading(),
      preConfirm: async (email) => {
        if (!EmailValidator.validate(email)) {
          msgSwal("Aviso", "Email inválido", "error", 4000);
          return;
        }

        const response = await fetch(
          `https://raw.githubusercontent.com/felipeM0/big-boom/main/src/data/users.json`
        );
        return { email, res: response.json() };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Promise.resolve(result.value?.res).then((v) => {
          for (let i = 0; i < v.length; i++) {
            if (v[i].email === result.value?.email) {
              msgSwal(
                `Olá, ${v[i].name.split(" ").slice(0, -1).join(" ")}!`,
                `Link de recuperação enviado para <strong>${result.value?.email}</strong>, verifique seu email </br> (e não esqueça da caixa de SPAM)`,
                "success",
                0
              );
              return;
            }
          }
        });

        msgSwal(
          "Aviso",
          "Email não reconhecido, verifique essa informação",
          "error",
          4000
        );
      }
    });
  };

  return (
    <div id="Login-content">
      <div className="bg-move-gradient" />
      <div>
        <div id="f-box" className="first-box">
          <img src={LogoImg} alt="Logo" />

          <div className={`msg-top ${showPass ? "is-flipped" : ""}`}>
            <div className="dv-msg-top-inside">
              <p>Entrar no BigBoom</p>
            </div>
            <div className="dv-msg-top-inside dv-msg-top-back">
              <p>Muito bom ver você!</p>
              <span>{email}</span>
            </div>
          </div>

          <div className="flip-box">
            <div className={`msg-middle ${showPass ? "is-flipped" : ""}`}>
              <form
                id="email-form"
                onSubmit={handleEmail}
                className="dv-msg-middle-inside"
              >
                <div className="dv-inp">
                  <input
                    required
                    type="email"
                    name="Email"
                    value={email}
                    placeholder="Endereço de email"
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${
                      email.length > 0
                        ? EmailValidator.validate(email)
                          ? ""
                          : "error"
                        : ""
                    }`}
                  />
                  <span>Insira um email válido</span>
                </div>

                <button
                  type="submit"
                  className="btn-principal"
                  disabled={!EmailValidator.validate(email)}
                >
                  Continuar
                </button>
              </form>
              <form
                id="pass-form"
                onSubmit={handlePass}
                className="dv-msg-middle-inside dv-msg-middle-back"
              >
                <div className="dv-inp">
                  <input
                    required
                    name="Password"
                    value={password}
                    placeholder="Agora a sua senha"
                    type={`${showInputPass ? "text" : "password"}`}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${
                      password.length > 0
                        ? password.length >= 6
                          ? ""
                          : "error"
                        : ""
                    }`}
                  />
                  <span>No mínimo 6 caracteres</span>

                  {!showInputPass ? (
                    <Tooltip placement="top" title="Exibir senha">
                      <VisibilityIcon
                        onClick={() => setShowInputPass(!showInputPass)}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip placement="top" title="Ocultar senha">
                      <VisibilityOffIcon
                        onClick={() => setShowInputPass(!showInputPass)}
                      />
                    </Tooltip>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-principal"
                  disabled={password.length <= 5}
                >
                  Logar
                </button>

                <button type="button" onClick={returnLink}>
                  Voltar
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-login">
        <div className={`msg-footer ${showPass ? "is-flipped" : ""}`}>
          <div className="dv-msg-footer-inside">
            <span>Não tem uma conta?</span>
            <button onClick={() => goToNext("new-account")}>
              <span>Crie uma!</span>
            </button>
          </div>
          <div className="dv-msg-footer-inside dv-msg-footer-back">
            <span>Esqueceu sua senha?</span>
            <button onClick={recoverPass}>
              <span>Clique aqui!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
