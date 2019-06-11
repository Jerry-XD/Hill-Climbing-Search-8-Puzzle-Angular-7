import { Component, OnInit } from "@angular/core";
import { SolverService } from "../services/solver.service";
import Swal from 'sweetalert2'

@Component({
  selector: "app-puzzle",
  templateUrl: "./puzzle.component.html",
  styleUrls: ["./puzzle.component.scss"]
})
export class PuzzleComponent implements OnInit {

  isActive = false;

  public interval_value: number = 500;
  public limit: boolean = false;
  public random: boolean = false;
  public tiles_state_h: number;
  public tiles_goal_state_h: number;
  public state: any;
  public goal_state: any;
  public tiles_state: any = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  public u: any = [];
  public d: any = [];
  public l: any = [];
  public r: any = [];
  public move_h: any = [99, 99, 99, 99]; //ขึ้น0 ลง1 ซ้าย2 ขวา3
  public move_h_bu: any = []; //ขึ้น0 ลง1 ซ้าย2 ขวา3
  public move_h_bu_2: any = []; //ขึ้น0 ลง1 ซ้าย2 ขวา3
  public num_arr: any = [];
  public clean_array: any[];
  public tiles_state_backup: any = [];
  public tiles_goal_state: any = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  public rd_move: any = [];
  public interval: any = null; // สถานะการ Interval ของโปรแกรม
  public status: "idle" | "running";
  public count: number = 0;
  public count_limit: number = 20;
  public min_count: number = 0;
  public min_tmp_previous: number;

  constructor(private ss: SolverService) { }

  public ngOnInit() {
    this.status = "idle";
    this.update_h();
    //this.state = "1,2,3,4,5,6,7,8,0"
    //this.tiles_state = this.state.split(',').map(Number);
    //console.log(this.tiles_state.length);
    //this.goal_state = "1,2,3,4,5,6,7,8,0"
    //this.tiles_goal_state = this.goal_state.split(',').map(Number);
    //console.log(this.tiles_goal_state.length);
  }

  public startProgram(): void {
    this.status = "running";
    //วนทำงานเป็นรอบ
    this.interval = setInterval(() => {
      this.solvePuzzle();
      this.count += 1;
      if (this.tiles_state_h == 0) {
        this.clearInterval();
        Swal.fire({
          title: "ค้นหาสำเร็จแล้ว !",
          type: 'success',
        });
      }
      if (this.count == this.count_limit && this.limit == true) {
        this.clearInterval();
      }
    }, this.interval_value);
  }

  public solvePuzzle() {
    this.update_h();
    //หาค่า Heuristic
    this.tiles_state_h = this.find_h(this.tiles_state, this.tiles_goal_state);
    //คำนวณการขยับครั้งต่อไป    
    this.findNextStep();
    //ล้างค่าการขยับ
    this.move_h = [99, 99, 99, 99]; //ขึ้น0 ลง1 ซ้าย2 ขวา3    
    this.update_h();
  }

  public find_h(h1, h2) {
    let result = 0;
    for (let n = 0; n <= 8; n++) {
      if (h1[n] != h2[n]) {
        if (h1[n] == 0) {
          continue;
        }
        result += 1;
      }
    }
    return result;
  }

  public update_h() {
    this.tiles_state_h = this.find_h(this.tiles_state, this.tiles_goal_state);
  }

  public findNextStep() {
    //คำนวณหาการขยับครั้งต่อไป
    for (let n = 0; n <= this.tiles_state.length; n++) {
      let index = this.tiles_state.indexOf(n); //ตำแหน่งของตัวปัจจุบัน
      let zero = this.tiles_state.indexOf(0); //ตำแหน่งของ 0 (ช่องว่าง)
      let boundray = zero - index;
      if (boundray == 1 && zero != 6 && zero != 3 && zero != 0) { //ขยับขวา 
        //ตำแหน่งของการขยับขวา            
        this.r = [...this.tiles_state];
        this.r[zero - 1] = this.r.splice(zero, 1, this.r[zero - 1])[0];
        //เก็บค่า H ของการขยับขวา        
        this.move_h[3] = this.find_h(this.r, this.tiles_goal_state);
      }
      else if (boundray == -1 && zero != 2 && zero != 5) { //ขยับซ้าย
        //ตำแหน่งของการขยับซ้าย        
        this.l = [...this.tiles_state];
        this.l[zero + 1] = this.l.splice(zero, 1, this.l[zero + 1])[0];
        //เก็บค่า H ของการขยับซ้าย
        this.move_h[2] = this.find_h(this.l, this.tiles_goal_state);
      }
      else if (boundray == -3) { //ขยับขึ้น
        //ตำแหน่งของการขยับซ้าย       
        this.u = [...this.tiles_state];
        this.u[zero + 3] = this.u.splice(zero, 1, this.u[zero + 3])[0];
        //เก็บค่า H ของการขยับขึ้น
        this.move_h[0] = this.find_h(this.u, this.tiles_goal_state);
      }
      else if (boundray == 3 && zero != 2) { //ขยับลง 
        //ตำแหน่งของการขยับลง        
        this.d = [...this.tiles_state];
        this.d[zero - 3] = this.d.splice(zero, 1, this.d[zero - 3])[0];
        //เก็บค่า H ของการขยับลง
        this.move_h[1] = this.find_h(this.d, this.tiles_goal_state);
      }
    }
    let min_move_tmp = this.getMin(this.move_h);
    if (min_move_tmp > this.tiles_state_h) {
      this.clearInterval();
      Swal.fire({
        type: 'error',
        title: 'หยุดการค้นหา !',
        text: 'พบค่า Local Maximum = ' + this.tiles_state_h
      })
    } else {
      //สำรองค่า H ของการขยับ
      this.move_h_bu = [...this.move_h];
      //หาค่า H ของการขยับที่น้อยที่สุดโดยการลบค่ามากสุดออกจากอาเรย์ move_h    
      for (let i = 0; i <= this.move_h.length; i++) {
        let avg_num_arr: number = 0;
        let len_num: number = 0;
        let min_move_arr: any;
        let min_num_move_arr: number = 0;
        for (let j = 0; j < this.move_h.length; j++) {
          this.num_arr[j] = parseInt(this.move_h[j]);
          avg_num_arr += this.num_arr[j];
        }
        len_num = parseInt(this.move_h.length);
        avg_num_arr /= len_num;
        min_move_arr = this.getMin(this.move_h);
        min_num_move_arr = parseInt(min_move_arr);
        //ถ้าเจอว่าค่าไม่เท่ากัน ให้ลบตัวมากสุดออกจากอาเรย์ move_h จนเหลือแต่ตัวที่มีค่าน้อยที่สุด
        if (avg_num_arr > min_num_move_arr) {
          let test = this.getMax(this.move_h);
          this.move_h.splice(this.move_h.indexOf(test), 1);
        }
        //console.log(avg_num_arr);
        avg_num_arr = 0;
        //console.log(avg_num_arr);
      }
      //เก็บจำนวนตัวของค่าน้อยที่สุดไว้    
      let test: number = 0;
      test = parseInt(this.move_h.length);
      let action: number = 0;
      let rd: number = 0;
      //ถ้ามีค่า H เท่ากันหลายตัว    
      this.move_h_bu_2 = [...this.move_h_bu]
      if (test > 1) {
        let test_tmp: number = 0;
        test_tmp = this.move_h[0];
        let count = 0;
        for (let j = 0; j < this.move_h_bu_2.length; j++) {
          if (test_tmp == this.move_h_bu_2[j]) {
            //เก็บค่า index ของตัวที่มีค่าน้อยสุดทุกตัว (ขึ้น0 ลง1 ซ้าย2 ขวา3)          
            this.rd_move[count] = this.move_h_bu_2.indexOf(test_tmp);
            this.move_h_bu_2[j] += 99;
            count++;
          }
        }
        let rd_tmp: number = 0;
        //หาว่ามีกี่ตัว      
        rd_tmp = parseInt(this.rd_move.length);
        //สุ่มเลือกตัวเอาเดียวโดยใช้ index อ้างอิง      
        rd = Math.floor(Math.random() * rd_tmp);
        //ดึงค่า index ของตัวที่สุ่มได้ (ขึ้น0 ลง1 ซ้าย2 ขวา3)      
        action = this.rd_move[rd];
        //ตรวจค่า Local Maximum
        let min_tmp = this.getMin(this.move_h);
        if (this.tiles_state_h == min_tmp) {
          if (min_tmp == this.min_tmp_previous) {
            this.min_count += 1;
          } else {
            this.min_count = 0;
          }
        }
        this.min_tmp_previous = min_tmp;
        if (this.min_count == 5) {
          clearInterval(this.interval);
          this.status = "idle";
          this.update_h();
          Swal.fire({
            title: 'พบค่า Local Maximum จำนวนมาก',
            text: 'การค้นหาต่อมีโอกาสที่จะไม่พบคำตอบ ยืนยันจะทำต่อหรือไม่ ?',
            type: 'info',
            showCancelButton: true,
            focusCancel: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ค้นหาต่อ',
            cancelButtonText: 'หยุดการค้นหา',
            reverseButtons: false
          }).then((result) => {
            if (result.value) {
              this.startProgram();
            } else if (
              result.dismiss === Swal.DismissReason.cancel
            ) {
              this.clearInterval();
            }
          })
        }
      }
      //ถ้ามีตัวเดียว    
      else {
        //ดึงค่า index ของตัวนั้น (ขึ้น0 ลง1 ซ้าย2 ขวา3)  
        let value = this.move_h[0];
        action = this.move_h_bu.indexOf(value);
        //this.min_count = 0;
      }
      //ขยับแผ่นป้ายตาม index ของตัวที่เลือกมา (ขึ้น0 ลง1 ซ้าย2 ขวา3)    
      if (action == 0) {
        this.tiles_state = [...this.u];
        //console.log("ขึ้น");
      }
      else if (action == 1) {
        this.tiles_state = [...this.d];
        //console.log("ลง");
      }
      else if (action == 2) {
        this.tiles_state = [...this.l];
        //console.log("ซ้าย");
      }
      else if (action == 3) {
        this.tiles_state = [...this.r];
        //console.log("ขวา");
      }
    }
  }

  public getMax(value) {
    return Math.max(...value);
  }

  public getMin(value) {
    return Math.min(...value);
  }

  public onClick(s, arr) {
    let index = arr.indexOf(s);
    let zero = arr.indexOf(0);
    let boundray = zero - index;
    if (boundray == 1 && zero != 6 && zero != 3/*ขวา*/ || boundray == -1 && zero != 2 && zero != 5/*ซ้าย*/ || boundray == 3/*ลง*/ || boundray == -3/*ขึ้น*/) {
      arr[index] = arr.splice(zero, 1, arr[index])[0];
    }
    this.update_h();
  }

  public moveTile(move) {
    let zero = this.tiles_state.indexOf(0);
    for (let n = 0; n <= this.tiles_state.length; n++) {
      let index = this.tiles_state.indexOf(n);
      let boundray = zero - index;
      if ((boundray == 1 && zero != 6 && zero != 3 && zero != 0) && move == 'right') {
        this.tiles_state[zero - 1] = this.tiles_state.splice(zero, 1, this.tiles_state[zero - 1])[0];
      }
      else if ((boundray == -1 && zero != 2 && zero != 5) && move == 'left') {
        this.tiles_state[zero + 1] = this.tiles_state.splice(zero, 1, this.tiles_state[zero + 1])[0];
      }
      else if (boundray == -3 && move == 'up') {
        this.tiles_state[zero + 3] = this.tiles_state.splice(zero, 1, this.tiles_state[zero + 3])[0];
      }
      else if ((boundray == 3 && zero != 2) && move == 'down') {
        this.tiles_state[zero - 3] = this.tiles_state.splice(zero, 1, this.tiles_state[zero - 3])[0];
      }
    }
  }

  public clearInterval(): void {
    clearInterval(this.interval);
    this.status = "idle";
    this.update_h();
    this.clear_count();
  }

  public resetTile(arr) {
    if (arr == this.tiles_state) {
      this.tiles_state = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    }
    else if (arr = this.tiles_goal_state) {
      this.tiles_goal_state = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    }
    this.update_h();
    this.clear_count();
  }

  public clear_count() {
    this.count = 0;
    this.min_count = 0;
  }

  public stopProgram(): void {
    window.location.reload();
  }

  public shuffle() {
    this.tiles_state.shuffle();
    this.state = '';
    for (let a of this.tiles_state) {
      if (this.tiles_state.indexOf(a) < this.tiles_state.length - 1)
        this.state += a + ',';
      else this.state += a;
    }
    this.update_h();
    this.clear_count();
  }
}

Array.prototype['shuffle'] = function () {
  var input = this;

  for (var i = input.length - 1; i >= 0; i--) {

    var randomIndex = Math.floor(Math.random() * (i + 1));
    var itemAtIndex = input[randomIndex];

    input[randomIndex] = input[i];
    input[i] = itemAtIndex;
  }
  return input;
}