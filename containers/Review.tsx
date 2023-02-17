import Cookies from "js-cookie";
import React, { useState } from "react";
import RatingReview from "../components/Rating/RatingReview";
import jwt_decode from "jwt-decode";
import { addReview } from "../services/product";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";

interface ReviewProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Review = ({ setOpen }: ReviewProps) => {
  const token = Cookies.get("token");

  const router = useRouter();

  const [currentStar, setCurrentStar] = useState<number>();
  const [contentReview, setContentReview] = useState<string>("");
  const [nameUser, setNameUser] = useState<string>("");

  const handleAddReview = async () => {
    if (token) {
      const decoded: any = jwt_decode(token);
      const commentUser = {
        idProduct: router.query.product,
        rating: Number(currentStar) + 1,
        name: decoded.firstName + " " + decoded.lastName,
        content: contentReview,
      };
      await addReview(commentUser);
    } else {
      const commentUser = {
        idProduct: router.query.product,
        rating: Number(currentStar) + 1,
        name: nameUser,
        content: contentReview,
      };
      await addReview(commentUser);
    }
    setOpen(false);
  };

  return (
    <>
      {!token && (
        <div>
          <Link href="/sign-in">
            <button className="bg-green-600 hover:bg-green-700 py-1 w-3/4 lg:w-1/2 block mx-auto rounded-md text-white text-base font-semibold">
              Đăng nhập để đánh giá
            </button>
          </Link>
          <p className="flex justify-center items-center my-3 relative after:border-t -z-10 after:absolute after:top-1/2 after:left-0 after:w-full">
            <span className="bg-[rgb(22,28,36)] px-2 text-white z-50 text-xs text-opacity-70">
              Hoặc
            </span>
          </p>
        </div>
      )}
      <div className="flex space-x-2 items-center mb-10">
        <span className="text-sm font-normal text-white">
          Đánh giá của bạn về sản phẩm:
        </span>
        <RatingReview
          currentStar={currentStar}
          setCurrentStar={setCurrentStar}
        />
      </div>
      {!token && (
        <div className="relative mb-5">
          <input
            id="name-product"
            onChange={(e) => setNameUser(e.target.value)}
            type="text"
            className={`peer text-white bg-transparent border w-full px-2.5 py-3 rounded-lg focus:border-white hover:border-white border-color-primary `}
          />
          <label
            className={`absolute text-base px-1 peer-focus:-top-3 text-white peer-focus:left-3 peer-focus:text-sm peer-focus:text-[rgb(99,115,129)] transition-all duration-300 bg-[rgb(22,28,36)] ${
              nameUser.length
                ? "bg-[rgb(33,43,54)] left-3 text-sm -top-3 text-[rgb(99,115,129)]"
                : "top-3 left-4 "
            }cursor-text `}
            htmlFor="name-product"
          >
            Tên của bạn
          </label>
        </div>
      )}
      <div className="relative w-[550px] h-[100px]">
        <textarea
          id="content-review"
          onChange={(e) => setContentReview(e.target.value)}
          className={`peer resize-none text-white bg-transparent border w-[61%] lg:w-full h-full px-2.5 py-3 rounded-lg focus:border-white hover:border-white border-color-primary `}
        />
        <label
          className={`absolute text-base px-1 peer-focus:-top-3 text-white peer-focus:left-3 peer-focus:text-sm peer-focus:text-[rgb(99,115,129)] transition-all duration-300 bg-[rgb(22,28,36)] ${
            contentReview.length
              ? "bg-[rgb(33,43,54)] left-3 text-sm -top-3 text-[rgb(99,115,129)]"
              : "top-3 left-4 "
          }  cursor-text `}
          htmlFor="content-review"
        >
          Review *
        </label>
      </div>
      <div className="text-white text-sm font-semibold mt-10 flex justify-end items-center space-x-3">
        <button
          onClick={() => setOpen(false)}
          className="border border-[rgba(145,158,171,0.32)] hover:bg-[rgba(145,158,171,0.08)] hover:border-white rounded-md px-3 py-1"
        >
          Hủy
        </button>
        <button
          onClick={handleAddReview}
          className="bg-green-600 hover:bg-green-700 rounded-md px-3 py-[5px]"
        >
          Thêm
        </button>
      </div>
    </>
  );
};

export default Review;
