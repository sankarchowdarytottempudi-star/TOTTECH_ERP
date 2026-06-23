interface Props {
  student: any;
}

export default function StudentHeader({
  student,
}: Props) {

  return (

    <div
      className="
      bg-gradient-to-r
      from-blue-600
      via-indigo-600
      to-purple-600
      rounded-3xl
      p-8
      text-white
      shadow-xl
      "
    >

      <div className="flex items-center gap-6">

        <div
          className="
          w-24
          h-24
          rounded-full
          bg-white/20
          flex
          items-center
          justify-center
          text-4xl
          font-black
          "
        >
          {student?.first_name?.charAt(0)}
        </div>

        <div>

          <h1 className="text-4xl font-black">

            {student.first_name}
            {" "}
            {student.last_name}

          </h1>

          <p className="text-lg opacity-90 mt-2">
            Enrollment:
            {" "}
            {student.enrollment_number}
          </p>

          <p className="opacity-80">
            Class:
            {" "}
            {student.school_class}
          </p>

        </div>

      </div>

    </div>

  );

}
