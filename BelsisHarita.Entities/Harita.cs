using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace BelsisHarita.Entities
{
    public class Harita
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [StringLength(100)]
        public string Sehir { get; set; }
        [StringLength(100)]
        public string Ilce { get; set; }
        [StringLength(100)]
        public string Mahalle { get; set; }
        [StringLength(50)]
        public string GeoType { get; set; }
        [StringLength(200)]
        public string Koordinat { get; set; }
    }
}
