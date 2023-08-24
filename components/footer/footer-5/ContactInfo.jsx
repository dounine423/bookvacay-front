const ContactInfo = () => {
  const contactContent = [
    // {
    //   id: 1,
    //   title: "Toll Free Customer Care",
    //   action: "+(2) 772 892 2972",
    //   text: "+(2) 772 892 2972",
    // },
    {
      id: 2,
      title: "Need live support?",
      action: "mailto:xyz@abc.com",
      text: "admin@bookvacay.online",
    },
  ];
  return (
    <>
      {contactContent.map((item) => (
        <div className="col-sm-6" key={item.id}>
          {/* <div className={"text-14"}>{item.title}</div> */}
          {item.text}
        </div>
      ))}
    </>
  );
};

export default ContactInfo;
