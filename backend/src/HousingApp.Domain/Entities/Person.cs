namespace HousingApp.Domain.Entities
{
    public class Person
    {
        public string Id { get; private set; } = string.Empty;
        public string FirstName { get; private set; } = string.Empty;
        public string LastName { get; private set; } = string.Empty;
        public string Email { get; private set; } = string.Empty;
        public string PhoneNumber { get; private set; } = string.Empty;
        public string Nationality { get; private set; } = string.Empty;
        public int Age { get; private set; }
        public string Gender { get; private  set; } = string.Empty;
        public string ImageUrl { get; private set; } = string.Empty;
        public DateOnly BirthDate { get; private set; }
        
        public User? User { get; set; }
        
        public static Person CreatePerson(
            string firstName,
            string lastName,
            string email,
            string phoneNumber,
            string nationality,
            int age,
            string gender,
            string imageUrl,
            DateOnly birthDate)
        {
            return new Person
            {
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                PhoneNumber = phoneNumber,
                Nationality = nationality,
                Age = age,
                Gender = gender,
                ImageUrl = imageUrl,
                BirthDate = birthDate
            };
        }
        
        public static Person CreatePerson(
            string id,
            string firstName,
            string lastName,
            string email,
            string phoneNumber,
            string nationality,
            int age,
            string gender,
            string imageUrl,
            DateOnly birthDate,
            User? user)
        {
            return new Person
            {
                Id = id,
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                PhoneNumber = phoneNumber,
                Nationality = nationality,
                Age = age,
                Gender = gender,
                BirthDate = birthDate,
                ImageUrl = imageUrl,
                User = user
            };
        }
        
    }
}