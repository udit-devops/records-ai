const EmptyState = ({icon,title,description}:EmptyStateProps) => {
  return (
    <section className="empty-state">
         <div>
             <img src={icon} alt="icon" width={45} height={45} />
         </div>
         <article>
.            <h1>{title}</h1>
             <p>{description}</p>
         </article>
    </section>
  )
}

export default EmptyState