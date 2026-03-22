//componente boton sacado de uiverse
import styled from "styled-components";

const Button = ({ text, onClick, disabled }) => {
  return (
    <StyledWrapper>
      <button className="cta" onClick={onClick} disabled={disabled}>
        <span>{text}</span>
        <svg width="15px" height="10px" viewBox="0 0 13 10">
          <path d="M1,5 L11,5" />
          <polyline points="8 1 12 5 8 9" />
        </svg>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .cta {
    position: relative;
    margin: auto;
    padding: 12px 18px;
    transition: all 0.2s ease;
    border: none;
    background: none;
    cursor: pointer;
  }
  .cta:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    border-radius: 50px;
    background: #f5c842;
    width: 45px;
    height: 45px;
    transition: all 0.3s ease;
  }
  .cta span {
    position: relative;
    font-family: "DM Sans", sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: #1a1a1a;
  }
  .cta svg {
    position: relative;
    top: 0;
    margin-left: 10px;
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke: #1a1a1a;
    stroke-width: 2;
    transform: translateX(-5px);
    transition: all 0.3s ease;
  }
  .cta:hover:before {
    width: 100%;
    background: #f5c842;
  }
  .cta:hover svg {
    transform: translateX(0);
  }
  .cta:active {
    transform: scale(0.95);
  }
  .cta:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export default Button;
